import React from "react";

export default function Repository({ repository, onFetchMoreIssues, onStarRepository }) {
  return (
    <div>
      <p>
        <strong>In Repository</strong>
        <a href={repository.url}>{repository.name}</a>
      </p>
      <button type="button" onClick={() => onStarRepository()}>
      	{ repository.viewerHasStarred ? 'Unstar' : 'Star' }
      </button>
      <ul>
        {repository.issues.edges.map((issue) => (
          <li key={issue.node.id}>
            <a href={issue.node.url}>{issue.node.title}</a>

            <ul>
              {issue.node.reactions.edges.map((reaction) => (
                <li key={reaction.node.id}>{reaction.node.content}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <hr />
      {repository.issues.pageInfo.hasNextPage && (
        <button onClick={onFetchMoreIssues}>More</button>
      )}
    </div>
  );
}
