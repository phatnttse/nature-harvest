export class SubCategoryResponse {
  subcategoryId: number;
  name: string;
  categoryId: number;

  constructor(data: any) {
    this.subcategoryId = data.subcategoryId;
    this.name = data.name;
    this.categoryId = data.categoryId;
  }
}
