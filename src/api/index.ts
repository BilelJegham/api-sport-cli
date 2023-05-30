import { Football } from "./football";
import { Handball } from "./handball";
import { Rugby } from "./rugby";

export const SPORTS_API= {
    'football': new Football(),
    'rugby': new Rugby(), 
    'handball': new Handball()
}