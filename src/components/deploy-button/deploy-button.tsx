/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import classNames from "classnames";
import { toast } from "react-toastify";

import SpaceIcon from "@/assets/space.svg";
import Loading from "../loading/loading";
import Login from "../login/login";
import { Auth } from "../../utils/types";

function DeployButton({
  html,
  error = false,
  auth,
}: {
  html: string;
  error: boolean;
  auth?: Auth;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState<string | undefined>(undefined);

  const [config, setConfig] = useState({
    title: "",
  });

  const createSpace = async () => {
    setLoading(true);

    try {
      const request = await fetch("/api/deploy", {
        method: "POST",
        body: JSON.stringify({
          title: config.title,
          path,
          html,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await request.json();
      if (response.ok) {
        toast.success(
          path ? `Space updated successfully!` : `Space created successfully!`
        );
        setPath(response.path);
      } else {
        toast.error(response.message);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div className="relative max-lg:hidden flex items-center justify-end">
      {auth && (
        <p className="mr-3 text-sm text-gray-300">
          Connected as{" "}
          <a
            href={`https://huggingface.co/${auth.preferred_username}`}
            target="_blank"
            className="underline hover:text-white"
          >
            {auth.preferred_username}
          </a>
        </p>
      )}
      <button
        className={classNames(
          "relative cursor-pointer flex-none flex items-center justify-center rounded-md text-sm font-semibold leading-6 py-1.5 px-5 hover:bg-pink-400 text-white shadow-sm dark:shadow-highlight/20",
          {
            "bg-pink-400": open,
            "bg-pink-500": !open,
          }
        )}
        onClick={() => setOpen(!open)}
      >
        {path ? "Update Space" : "Deploy to Space"}
      </button>
      <div
        className={classNames(
          "h-screen w-screen bg-black/20 fixed left-0 top-0 z-10",
          {
            "opacity-0 pointer-events-none": !open,
          }
        )}
        onClick={() => setOpen(false)}
      ></div>
      <div
        className={classNames(
          "absolute top-[calc(100%+8px)] right-0 z-10 w-80 bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-75 overflow-hidden",
          {
            "opacity-0 pointer-events-none": !open,
          }
        )}
      >
        {!auth ? (
          <Login />
        ) : (
          <>
            <header className="flex items-center text-sm px-4 py-2 border-b border-gray-200 gap-2 bg-gray-100 font-semibold text-gray-700">
              <span className="text-xs bg-pink-500/10 text-pink-500 rounded-full pl-1.5 pr-2.5 py-0.5 flex items-center justify-start gap-1.5">
                <img src={SpaceIcon} alt="Space Icon" className="size-4" />
                Space
              </span>
              Configure Deployment
            </header>
            <main className="px-4 pt-3 pb-4 space-y-3">
              <p className="text-xs text-amber-600 bg-amber-500/10 rounded-md p-2">
                {path ? (
                  <span>
                    Your space is live at{" "}
                    <a
                      href={`https://huggingface.co/spaces/${path}`}
                      target="_blank"
                      className="underline hover:text-amber-700"
                    >
                      huggingface.co/{path}
                    </a>
                    . You can update it by deploying again.
                  </span>
                ) : (
                  "Deploy your project to a space on the Hub. Spaces are a way to share your project with the world."
                )}
              </p>
              {!path && (
                <label className="block">
                  <p className="text-gray-600 text-sm font-medium mb-1.5">
                    Space Title
                  </p>
                  <input
                    type="text"
                    value={config.title}
                    className="mr-2 border rounded-md px-3 py-1.5 border-gray-300 w-full text-sm"
                    placeholder="My Awesome Space"
                    onChange={(e) =>
                      setConfig({ ...config, title: e.target.value })
                    }
                  />
                </label>
              )}
              {error && (
                <p className="text-red-500 text-xs bg-red-500/10 rounded-md p-2">
                  Your code has errors. Fix them before deploying.
                </p>
              )}
              <div className="pt-2 text-right">
                <button
                  disabled={error || loading || !config.title}
                  className="relative rounded-full bg-black px-5 py-2 text-white font-semibold text-xs hover:bg-black/90 transition-all duration-100 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
                  onClick={createSpace}
                >
                  {path ? "Update Space" : "Create Space"}
                  {loading && <Loading />}
                </button>
              </div>
            </main>
          </>
        )}
      </div>
    </div>
  );
}

export default DeployButton;
