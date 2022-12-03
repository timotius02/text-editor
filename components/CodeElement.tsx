export default function CodeElement(props: any) {
  return (
    <pre {...props.attributes}>
      <code className="bg-red-500">{props.children}</code>
    </pre>
  );
}
