import {useHttp} from '../hooks/http.hooks';


const useMarvelService = () => {
  const {loading, request, error404, clearError} = useHttp();

  const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  const _apiKey = 'apikey=805b4b6df4e4023c65c6fe3c7b9f1aa9';
  const _baseOffset = 210; 


  const getAllCharacters = async (offset = _baseOffset) => {
    const res = await request(
      `${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`
    );
    return res.data.results.map(_transformCharacter); // формируем массив с полученными объектами преоброзовав их к state данным
  };

  const getOneCharacter = async (id) => {
    // асинхронный запрос на инфу 1 персонажа
    const res = await request(
      `${_apiBase}characters/${id}?${_apiKey}`
    );
    return _transformCharacter(res.data.results[0]); // вызываем метод в конкесте передавая базовый путь к данным
  };

  const _transformCharacter = (char) => {
    // присваиваем и возвращаем полученные данные к state данным
    return {
      key: char.id,
      name: char.name,
      description: char.description
        ? `${char.description.slice(0, 210)}...`
        : 'Sorry, there`s no information about this character',
      thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items.slice(0, 9),
    };
  };

  const getAllComics = async (offset = _baseOffset) => {
    const result = await request(
      `${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`
    );
    return result.data.results.map(_transformComics); // формируем массив с полученными объектами преоброзовав их к state данным
  };

  const _transformComics = (comics) => {
    return {
      key: comics.id,
      title: comics.title,
      description: comics.description || 'There is no description',
      pageCount: comics.pageCount ? `${comics.pageCount} p.` : 'No information about the number of pages',
      thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
      language: comics.textObjects.language || 'en-us',
      price: comics.prices.price ? `${comics.prices.price}$` : 'Price not available'
    }
  }

  return {loading, error404, getAllCharacters, getOneCharacter, getAllComics, clearError}
}

export default useMarvelService;
