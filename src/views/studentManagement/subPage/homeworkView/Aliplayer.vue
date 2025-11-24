<template>
  <div class="prism-player" :id="id"></div>
</template>
<script>
export default {
  name: "Aliplayer",
  props: {
    id: {
      type: String,
      default: "player",
    },
    url: String,
  },
  data() {
    return {
      player: null,
      observer: null,
      ids: [],
    };
  },
  mounted() {
    this.initPlayer(this.url, this.id);
    this.inViewport(this.id);
  },
  destroyed() {
    if (this.player) {
      this.player.pause();
      this.player = null;
    }
    this.observer.disconnect();
  },
  methods: {
    inViewport(id) {
      this.observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
          } else {
            if (this.player) {
              this.player.pause();
            }
          }
        }
      });
      this.observer.observe(document.getElementById(id));
    },
    initPlayer(url, id) {
      setTimeout(() => {
        this.player = new Aliplayer(
          {
            id: id,
            source: url,
            width: "80%",
            height: "400px",
            autoplay: false,
            isLive: false,
            rePlay: false,
            playsinline: true,
            preload: false,
            controlBarVisibility: "hover",
            useH5Prism: true,
            skinLayout: [
              {
                name: "bigPlayButton",
                align: "blabs",
                x: 30,
                y: 80,
              },
              {
                name: "H5Loading",
                align: "cc",
              },
              {
                name: "errorDisplay",
                align: "tlabs",
                x: 0,
                y: 0,
              },
              {
                name: "infoDisplay",
              },
              {
                name: "tooltip",
                align: "blabs",
                x: 0,
                y: 56,
              },
              {
                name: "thumbnail",
              },
              {
                name: "controlBar",
                align: "blabs",
                x: 0,
                y: 0,
                children: [
                  {
                    name:"progress",
                    align:"tlabs",
                    x: 0,
                    y:0
                  },
                  {
                    name: "playButton",
                    align: "tl",
                    x: 15,
                    y: 12,
                  },
                  {
                    name: "timeDisplay",
                    align: "tl",
                    x: 10,
                    y: 7,
                  },
                  {
                    name: "fullScreenButton",
                    align: "tr",
                    x: 10,
                    y: 12,
                  },
                  {
                    name: "setting",
                    align: "tr",
                    x: 15,
                    y: 12,
                  },
                  {
                    name: "volume",
                    align: "tr",
                    x: 5,
                    y: 10,
                  },
                ],
              },
            ],
          },
          (player) => {
            console.log("The player is created");
            player.on("ended", () => {
              if (!this.ids.includes(this.id)) {
                this.ids.push(this.id);
                this.$emit("onVideoEnded", {
                  id: this.id,
                  url: this.url,
                });
              }
            });
          }
        );
        this.player.on("error", (error) => {
          if (!this.ids.includes(this.id)) {
            this.ids.push(this.id);
            this.$emit("onVideoEnded", {
              id: this.id,
              url: this.url,
            });
          }
          this.$message({
            message: error.paramData.display_msg + error.paramData.error_code,
          });
        });
      }, 600);
    },
  },
};
</script>