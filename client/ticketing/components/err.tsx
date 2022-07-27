const Err = ({ err }: { err: any[] }) => {
  return (
    <div className="alert alert-danger">
      <h4>Ooops....</h4>
      <ul className="my-0">
        {err.map((err) => (
          <li key={err.message}>{err.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Err;
