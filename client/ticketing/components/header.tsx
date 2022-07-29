import Router from "next/router";
import useRequest from "../utils/hooks/useRequest";
import Link from "next/link";

const Header = ({ currentUser }: { currentUser: any }) => {
  const { doRequest, errors } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => Router.push("/"),
  });

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">GitTix</a>
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">
          {!currentUser && (
            <>
              <li className="nav-item">
                <Link href={"/auth/signin"}>
                  <a className="nav-link">Sign In</a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href={"/auth/signup"}>
                  <a className="nav-link">Sign Up</a>
                </Link>
              </li>
            </>
          )}
          {currentUser && (
            <li className="nav-item">
              <div onClick={doRequest} className="nav-link">
                Sign Out
              </div>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
