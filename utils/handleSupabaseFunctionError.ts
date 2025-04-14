export const getSupabaseError = async (error: any): Promise<string> => {
  const reader = error.context.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let result = '';
  let done = false;

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    if (value) {
      result += decoder.decode(value, { stream: true });
    }
  }

  const body = JSON.parse(result);
  return body.error || '';
};
