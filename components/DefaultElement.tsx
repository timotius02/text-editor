export default function DefaultElement(props: any) {
  return <p {...props.attributes}>{props.children}</p>;
}
