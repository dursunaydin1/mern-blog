import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import {
  BsGithub,
  BsLinkedin,
  BsTwitter,
  BsFacebook,
  BsInstagram,
} from "react-icons/bs";

const FooterCom = () => {
  return (
    <Footer className="border border-t-8 border-teal-500 ">
      <div className="w-full max-w-7xl mx-auto p-2">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="m-5">
            <Link
              to="/"
              className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white"
            >
              <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                Story's
              </span>
              Blog
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="ABOUT" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://www.100jsprojects.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  100jsProjects
                </Footer.Link>
                <Footer.Link
                  href="/about"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Story's Blog
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="FALLOW US" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://github.com/dursunaydin1/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Github
                </Footer.Link>
                <Footer.Link href="#">Discord</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="LEGAL" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy Policy</Footer.Link>
                <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright
            href="#"
            by="Story's Blog"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 sm:mt-0 sm:justify-center">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsTwitter} />
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon
              href="https://www.linkedin.com/in/dursunaydin/"
              target="_blank"
              icon={BsLinkedin}
            />
            <Footer.Icon
              href="https://github.com/dursunaydin1/"
              target="_blank"
              icon={BsGithub}
            />
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterCom;
