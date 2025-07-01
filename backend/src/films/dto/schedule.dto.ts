// interface SessionDto {
//   id: string;
//   daytime: string; // время сеанса
//   hall: string; // номер зала
//   rows: number; // количество рядов
//   seats: number; // количество мест
//   price: number; // цена билета
//   taken: boolean[]; // занятые места (например, [true, false, true])
// }

// interface ScheduleResponseDto {
//   total: number;
//   items: SessionDto[];
// }

export class ScheduleResponseDto {
  total: number;
  items: SessionDto[];
}

export class SessionDto {
  id: string;
  daytime: string;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}