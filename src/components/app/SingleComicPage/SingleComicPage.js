import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";


import loadingGear from '../../spinner/loading-gear.gif';
import ErrorMessage from '../../errorMessage/ErrorMessage';

import useMarvelService from '../../../services/MarvelService';

import './singleComicPage.scss';


const SingleComicPage = () => {
    const {comicId} = useParams();

    const [comic, setComic] = useState(null);

    const {loading, error404, getComic, clearError} = useMarvelService();

    useEffect(() => {
        updateComic();
    }, [comicId])

    let navigate = useNavigate();

    const updateComic = () => {
        clearError();
        getComic(comicId)
            .then(onComicLoaded)
            .catch((err) => (err ? navigate("*", { replace: true }) : null));
    }
    
    const onComicLoaded = (comic) => {
        // просто перезаписываем state как только данные загрузились, меняем статус загрузки и ошибки
        setComic (comic);
    }

    const errorMessage = error404 ? <ErrorMessage /> : null;
    const spinner = loading ? (
      <img src={loadingGear} alt="loading..." className="center" />
    ) : null;
    const content = !(loading || error404 || !comic) ? <View comic={comic} /> : null;

    return (
        <>
            {spinner}
            {errorMessage}
            {content}
        </>
    )
}

const View = ({comic}) => {
    const {title, description, pageCount, thumbnail, language, price} = comic;

    return (
        <div className="single-comic">
            <Helmet>
                <meta
                    name="description"
                    content={`${title} comic book`}
                    />
                <title>{title}</title>
            </Helmet>
            <img src={thumbnail} alt={title} className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{pageCount}</p>
                <p className="single-comic__descr">Language: {language}</p>
                <div className="single-comic__price">{price}</div>
            </div>
            <Link to="/comics"  className="single-comic__back">Back to all</Link>
        </div>
    )
}

export default SingleComicPage;