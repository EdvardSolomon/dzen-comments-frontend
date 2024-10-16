export default interface IComment {
  id: number;
  user_name: string;
  created_at: string;
  email: string;
  text: string;
  parent_id: number | null;
  image_url?: string;
}
