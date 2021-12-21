class MarvelService {
  _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  _apiKey = 'apikey=805b4b6df4e4023c65c6fe3c7b9f1aa9';

  getResource = async (url) => {
    //асинхронное получение данных с сервера по url
    let result = await fetch(url); //ожидание резульатов запроса, defualt 30 секунд

    if (!result.ok) {
      // проверяет результат fetch на наличие ошибок при запросе данных, т.к. 404 для него не ошибка.
      throw new Error(`Could not fetch ${url}, status: ${result.status}`); // если нет результата, создание ошибки и вывод
    }

    return await result.json(); // возвращение результата в виде promise в формате json
  };

  getAllCharacters = async () => {
    const res = await this.getResource(
      `${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`
    );
    return res.data.results.map(this._transformCharacter); // формируем массив с полученными объектами преоброзовав их к state данным
  };

  getOneCharacter = async (id) => {
    // асинхронный запрос на инфу 1 персонажа
    const res = await this.getResource(
      `${this._apiBase}characters/${id}?${this._apiKey}`
    );
    return this._transformCharacter(res.data.results[0]); // вызываем метод в конкесте передавая базовый путь к данным
  };

  _transformCharacter = (char) => {
    // присваиваем и возвращаем полученные данные к state данным
    return {
      id: char.id,
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
}
export default MarvelService;
