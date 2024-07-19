export class ForgotPasswordDto{
    email: string;

    constructor(data: any){
        this.email = data.email;
    }
}