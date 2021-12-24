import { Component } from 'react';
import loadingGear from '../spinner/loading-gear.gif';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {
  state = {
    char: {},
    loading: true,
    error404: false,
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.updateChar();
  }

  onError404 = () => {
    this.setState({ loading: false, error404: true });
  };

  onCharLoading =() => { // показываем спинер до загрузки
    this.setState({loading:true})
  }

  onCharLoaded = (char) => {
    // просто перезаписываем state как только данные загрузились, меняем статус загрузки и ошибки
    this.setState({ char, loading: false , error404: false});
  };

  updateChar = () => {
    this.onCharLoading();

    const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);

    this.marvelService
      .getOneCharacter(id)
      .then(this.onCharLoaded) // вызываем метод для 1 char и передаем его в метод onCharLoaded
      .catch(this.onError404);
  };

  render() {
    let { char, loading, error404 } = this.state;
    const errorMessage = error404 ? <ErrorMessage /> : null;
    const spinner = loading ? (
      <img src={loadingGear} alt="loading..." className="center" />
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

  let isImageFound = {
    objectFit: 'cover',
  };

  if (
    thumbnail ===
    'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
  ) {
    isImageFound = {
      'objectFit': 'contain',
    };
  }

  return (
    <div className="randomchar__block">
      <img
        src={thumbnail}
        alt="Random character"
        className="randomchar__img"
        style={isImageFound}
      />
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
