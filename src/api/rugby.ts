import { AbstractSport } from "./abstract-sport";

export class Rugby extends AbstractSport {
  constructor() {
    super('v1.rugby.api-sports.io', 'rugby', 'games', {
      timezone: 'Europe/Paris',
    })
  }
}
