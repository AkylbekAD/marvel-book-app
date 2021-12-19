import { Component } from 'react';
import loadingGear from '../spinner/loading-gear.gif';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {
  constructor(props) {
    super(props);
    this.updateChar();
  }
  state = {
    char: {},
    loading: true,
    error404: false,
  };

  marvelService = new MarvelService();

  onError404 = () => {
    this.setState({ loading: false, error404: true });
  };

  onCharLoaded = (char) => {
    // просто перезаписываем state как только данные загрузились, меняем статус загрузки
    this.setState({ char, loading: false });
  };

  updateChar = () => {
    const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
    this.marvelService
      .getOneCharacter(id)
      .then(this.onCharLoaded)
      .catch(this.onError404); // вызываем метод для 1 char и передаем его в метод onCharLoaded
  };

  render() {
    let { char, loading, error404 } = this.state;
    const errorMessage = error404 ? <ErrorMessage /> : null;
    const spinner = loading ? (
      <img src={loadingGear} alt="loading..." class="center" />
    ) : null;
    const content = !(loading || error404) ? <View char={char} /> : null;

    return (
      <div className="randomchar">
        {errorMessage}
        {spinner}
        {content}
        <div className="randomchar__static">
          <p className="randomchar__title">
            Random character for today!
            <br />
            Do you want to get to know him better?
          </p>
          <p className="randomchar__title">Or choose another one</p>
          <button onClick={this.updateChar} className="button button__main">
            <div className="inner">try it</div>
          </button>
          <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
        </div>
      </div>
    );
  }
}

const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki } = char;

  return (
    <div className="randomchar__block">
      <img src={thumbnail} alt="Random character" className="randomchar__img" />
      <div className="randomchar__info">
        <p className="randomchar__name">{name}</p>
        <p className="randomchar__descr">{description}</p>
        <div className="randomchar__btns">
          <a href={homepage} className="button button__main">
            <div className="inner">homepage</div>
          </a>
          <a href={wiki} className="button button__secondary">
            <div className="inner">Wiki</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default RandomChar;
