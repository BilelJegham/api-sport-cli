import { AbstractSport } from "./abstract-sport";

export class Handball extends AbstractSport {
  constructor() {
    super('v1.handball.api-sports.io', 'handball', 'games', {
      timezone: 'Europe/Paris',
    })
  }
}
