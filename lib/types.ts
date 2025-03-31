export interface Favorite {
  _id: string; // MongoDB automatically adds this field
  userId: string;
  recipe: string;
  likes: number
}