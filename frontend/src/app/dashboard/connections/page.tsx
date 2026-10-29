"use client";

import { useAtomValue } from "jotai";
import Link from "next/link";
import { hydratedAuthStateAtom } from "../../../state/authState";
import { useGetFollowRequests } from "../../../hooks/followService/useGetAllFollowRequests";
import { useGetAllFollowers } from "../../../hooks/followService/useGetAllFollowers";
import { useUpdateFollowRequest } from "../../../hooks/followService/useUpdateFollowRequest";
import ProtectedRoute from "../../../components/ProtectedRoute";
import Avatar from "../../../components/Avatar";
import Button from "../../../components/Button";

const FollowsPage = () => {
  const user = useAtomValue(hydratedAuthStateAtom);
  const { data: followRequests } = useGetFollowRequests();
  const { data: followers } = useGetAllFollowers(user.id);
  const { mutate: updateFollow } = useUpdateFollowRequest();

  return (
    <ProtectedRoute>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <h1 className="text-xl font-semibold">Connections</h1>

        <section className="flex flex-col gap-3">
          <h2 className="section-label">Follow requests</h2>
          {followRequests?.length ? (
            <ul className="card divide-y divide-gray-300 p-0 dark:divide-slate-800">
              {followRequests.map((followRequest) => (
                <li
                  key={followRequest.id}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <Link
                    href={`/dashboard/users/profile?id=${followRequest.follower.id}`}
                    className="flex items-center gap-3"
                  >
                    <Avatar src={followRequest.follower.profilePicture} name={followRequest.follower.name} />
                    <p>
                      <span className="font-semibold hover:underline">{followRequest.follower.name}</span>{" "}
                      <span className="text-muted">wants to follow you</span>
                    </p>
                  </Link>
                  <div className="flex gap-2">
                    <Button onClick={() => updateFollow({ id: followRequest.id, followStatus: "ACCEPTED" })}>
                      Accept
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => updateFollow({ id: followRequest.id, followStatus: "REJECTED" })}
                    >
                      Reject
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="card text-muted">You have no follow requests.</p>
          )}
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="section-label">Followers · {followers?.length ?? 0}</h2>
          {followers?.length ? (
            <ul className="card divide-y divide-gray-300 p-0 dark:divide-slate-800">
              {followers.map((follow) => (
                <li key={follow.id} className="px-5 py-3">
                  <Link
                    href={`/dashboard/users/profile?id=${follow.follower?.id}`}
                    className="flex items-center gap-3"
                  >
                    <Avatar src={follow.follower?.profilePicture} name={follow.follower?.name} />
                    <span className="font-semibold hover:underline">{follow.follower?.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="card text-muted">You have no followers yet.</p>
          )}
        </section>
      </div>
    </ProtectedRoute>
  );
};

export default FollowsPage;
