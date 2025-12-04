import { Review } from "../domain/model/review.entity";

export interface ReviewViewModel extends Review {
  userName: string;
  userPhoto: string;
}
