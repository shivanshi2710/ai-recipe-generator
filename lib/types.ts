export interface Favorite {
  _id: string; // MongoDB automatically adds this field
  recipe: string;
  likes: number
}