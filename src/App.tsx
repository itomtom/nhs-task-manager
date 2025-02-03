import TashDashboard from './components/TaskDashboard';

function App() {
  return (
    <div className="container mx-auto md:px-0 px-2">
      <h1 className="text-4xl font-bold my-6 text-primary-100 italic text-center">
        <span className="bg-primary-100 text-white px-1.5">NHS</span> Task
        Manager
      </h1>
      <TashDashboard />
    </div>
  );
}

export default App;
