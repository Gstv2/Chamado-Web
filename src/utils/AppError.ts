// Classe padrão para erros da aplicação
// Permite definir uma mensagem e um código de status HTTP
export class AppError {
  public readonly message: string;
  public readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
}
