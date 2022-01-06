import {useState, useCallback} from 'react';

export const useHttp = () => {
    const [loading, setLoading] = useState (false);
    const [error404, setError404] = useState (null);

    const request = useCallback(async (url, method = 'GET', body = null, headers = {'Content-Type': 'application/json'}) => {
        
        setLoading(true);

        try {
            const response = await fetch(url, {method, body, headers});


            if (!response.ok) {
                throw new Error(`Could not fetch ${url}, status: ${response.status}`); // если нет результата, создание ошибки и вывод
              }

              const data = await response.json();

              setLoading (false);
              return data;

        } catch (e) {
              setLoading (false);
              setError404 (e.message);
              throw e;
        }

    }, []);

    const clearError = useCallback(() => setError404(false), []);

    return {loading, request, error404, clearError}
};