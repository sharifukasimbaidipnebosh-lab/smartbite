import Menu from "./components/Menu";

export default function Home() {
  return (
    <main className="min-h-screen bg-yellow-50 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-red-600 mt-10">
        🍗 SmartBite AI
      </h1>

      <Menu />
    </main>
  );
}