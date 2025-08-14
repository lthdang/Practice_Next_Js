import Head from "next/head";

export default function Login() {
  return (
    <>
      <Head>
        <title>Glassmorphism Login Page</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <section>
        <div className="leaves">
          <div className="set">
            <div>
              <img src="/images/leaf_01.png" alt="leaf" />
            </div>
            <div>
              <img src="/images/leaf_02.png" alt="leaf" />
            </div>
            <div>
              <img src="/images/leaf_03.png" alt="leaf" />
            </div>
            <div>
              <img src="/images/leaf_04.png" alt="leaf" />
            </div>
            <div>
              <img src="/images/leaf_01.png" alt="leaf" />
            </div>
            <div>
              <img src="/images/leaf_02.png" alt="leaf" />
            </div>
            <div>
              <img src="/images/leaf_03.png" alt="leaf" />
            </div>
            <div>
              <img src="/images/leaf_04.png" alt="leaf" />
            </div>
          </div>
        </div>

        <img src="/images/bg.jpg" className="bg" alt="background" />
        <img src="/images/girl.png" className="girl" alt="girl" />
        <img src="/images/trees.png" className="trees" alt="trees" />

        <div className="login">
          <h2>Sign In</h2>
          <div className="inputBox">
            <input type="text" placeholder="Username" />
          </div>
          <div className="inputBox">
            <input type="password" placeholder="Password" />
          </div>
          <div className="inputBox">
            <input type="submit" value="Login" id="btn" />
          </div>
          <div className="group">
            <a href="#">Forget Password</a>
            <a href="#">Signup</a>
          </div>
        </div>
      </section>
    </>
  );
}
