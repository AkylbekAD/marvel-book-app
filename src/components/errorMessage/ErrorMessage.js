import img from './error404.gif';

const ErrorMessage = () => {
  return (
    <img
      src={img}
      alt="error 404"
      style={{
        display: 'block',
        width: '250px',
        height: '250px',
        objectFit: 'contain',
        margin: '0 auto',
      }}
    />
  );
};

export default ErrorMessage;
