<script>
export default {
  name: "FreeRender",
  functional: true,
  props: {
    scope: Object,
    render: Function,
  },
  render: (h, ctx) => {
    return <div>{ctx.props.render?.(h, ctx.props.scope)}</div>;
  },
};
</script>
