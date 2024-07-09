export class SubcategoryDto {
  name: string;
  categoryId: number;

  constructor(data: any) {
    this.name = data.name;
    this.categoryId = data.categoryId;
  }
}
