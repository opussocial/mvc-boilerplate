import { Response } from 'express';

export interface ActionResponse<T> {
  success: true;
  data: T;
  status?: number;
}

export interface ActionError {
  success: false;
  error: string;
  status: number;
}

export type ActionResult<T> = ActionResponse<T> | ActionError;

/**
 * Executes a logic unit (Action) and handles potential errors.
 * This is the "executor func" mentioned in the architecture pattern.
 */
export async function executeAction<TParams, TResult>(
  action: (params: TParams) => Promise<TResult> | TResult,
  params: TParams
): Promise<ActionResult<TResult>> {
  try {
    const result = await action(params);
    return { success: true, data: result };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
      status: error.status || 400
    };
  }
}

/**
 * Controller helper to respond based on ActionResult
 */
export function handleActionResult(res: Response, result: ActionResult<any>, successStatus = 200) {
  if (result.success) {
    return res.status(result.status || successStatus).json(result.data);
  } else {
    // result is ActionError here
    return res.status((result as ActionError).status).json({ error: (result as ActionError).error });
  }
}
