import TextEditor from "../components/TextEditor";

export default function Home() {
  return (
    <main className="bg-grey-300 container mx-auto mt-8 h-full">
      <div className="mx-auto h-full max-w-4xl bg-white p-8">
        <TextEditor></TextEditor>
      </div>
    </main>
  );
}
