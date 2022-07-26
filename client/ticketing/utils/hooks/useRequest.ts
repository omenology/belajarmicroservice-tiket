import axios from "axios";
import { useState } from "react";

const useRequest = ({ url, method, body, onSuccess }: { url: string; method: string; body: object; onSuccess: Function }) => {
  const [errors, setErrors] = useState<any>(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      const response = await axios({
        url,
        method,
        data: body,
      });

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (error) {
      const err = error as any;
      setErrors(err.response.data.errors);
    }
  };

  return { doRequest, errors };
};

export default useRequest;
