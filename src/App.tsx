import CommentForm from "./components/CommentForm";
import CommentList from "./components/CommentList";

export default function App() {
  return (
    <div className='py-20 px-10 bg-purple-700 min-h-screen'>
      <CommentForm />
      <CommentList />
    </div>
  );
}
