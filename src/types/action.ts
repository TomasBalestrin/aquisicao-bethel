export interface ActionResponse {
  success: boolean;
  error?: string;
}

export interface ActionResponseWithData<T> extends ActionResponse {
  data?: T;
}
