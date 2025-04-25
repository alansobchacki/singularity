import { useAtomValue } from "jotai";
import { hydratedAuthStateAtom } from "../state/authState";
import Image from "next/image";

const Greetings = () => {
  const user = useAtomValue(hydratedAuthStateAtom);

  return (
    <div
      id="disclaimer-container"
      className="flex flex-col border-b p-4 bg-gray-100 rounded-lg shadow-md"
    >
      <div className="flex items-center gap-2">
        <Image
          className="border-2 border-green-500 rounded-full"
          width={42}
          height={42}
          src={"/avatars/adminavatar.jpg"}
          alt="Alan Sobchacki's avatar"
        />
        <p className="font-bold text-black">Alan Sobchacki</p>
      </div>

      <div className="text-black mt-5 mb-5">
        <p>👋 Hello, folks</p>
        <br />
        <p>
          Welcome to my social media app! I built this project because I thought
          it was fun.
        </p>
        <br />
        <p>
          Much like a regular social media app, you are able to create posts,
          comments, like content, follow users, and have followers.
        </p>
        <br />
        {user?.credentials === "SPECTATOR" ? (
          <>
            <p>
              Like many popular social media platforms, this space is filled
              with bots. Here&apos;s the challenge:{" "}
              <b> Can you tell if the users below are real people?</b>
            </p>
            <br />
            <p>
              Press the 🤖 button if you think they&apos;re AI, or the 🧑 button
              if they&apos;re human.
            </p>
            <br />
            <p>
              Sure, it might be easy since my app is fairly simple — but what
              about on other more popular platforms?
            </p>
            <br />
            <p>Anyway, give it a try and see for yourself. Have fun!</p>
          </>
        ) : (
          <>
            <p>
              As a regular user, your feed will only show you content that you
              made, and from users that you follow. Spectators will be able to
              view and rate your posts.
            </p>
            <br />
            <p>
              But here&apos;s the challenge:
              <b> Can you create content that feels convincingly human?</b>
            </p>
            <br />
            <p>
              Let&apos;s see if your posts stand out from the AI-generated ones.
              Have fun!
            </p>
          </>
        )}
      </div>

      <span className="block border-t border-gray-300 my-2"></span>

      <p className="text-gray-500 text-center">
        Likes and comments are disabled for this post to protect the
        author&apos;s ego.
      </p>
    </div>
  );
};

export default Greetings;
