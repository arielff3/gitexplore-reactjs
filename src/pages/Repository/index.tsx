import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import api from '../../services/api';

import { Header, RepositoryInfo, Issues } from './styles';

import logo from '../../assets/logo.svg';

interface RepositoryParams {
  repository: string;
}

interface Repository {
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface Issue {
  id: number;
  title: string;
  html_url: string;
  user: {
    login: string;
  };
}

const Repository: React.FC = () => {
  const [repo, setRepo] = useState<Repository | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);

  const { repository } = useParams<RepositoryParams>();

  useEffect(() => {
    api.get(`repos/${repository}`).then((response) => {
      setRepo(response.data);
    });

    api.get(`repos/${repository}/issues`).then((response) => {
      setIssues(response.data);
    });

    // async function loadData(): Promise<void> {
    //   const [repo, issues] = await Promise.all([
    //     api.get(`repos/${repository}`),
    //     api.get(`repos/${repository}/issues`),
    //   ]);
    // }

    // loadData();
  }, [repository]);

  return (
    <>
      <Header>
        <img src={logo} alt="logo" />
        <Link to="/">
          <FiChevronLeft size={20} />
          Voltar
        </Link>
      </Header>
      {repo && (
        <RepositoryInfo>
          <header>
            <img src={repo.owner.avatar_url} alt={repo.owner.login} />
            <div>
              <strong>{repo.full_name}</strong>
              <p>{repo.description}</p>
            </div>
          </header>
          <ul>
            <li>
              <strong>{repo.stargazers_count}</strong>
              <span>Stars</span>
            </li>
            <li>
              <strong>{repo.forks_count}</strong>
              <span>Forks</span>
            </li>
            <li>
              <strong>{repo.open_issues_count}</strong>
              <span>Issues</span>
            </li>
          </ul>
        </RepositoryInfo>
      )}

      <Issues>
        {issues.map((issue) => {
          return (
            <a
              href={issue.html_url}
              rel="noreferrer"
              target="_blank"
              key={issue.id}
            >
              <div>
                <strong>{issue.title}</strong>
                <p>{issue.user.login}</p>
              </div>

              <FiChevronRight size={20} />
            </a>
          );
        })}
      </Issues>
    </>
  );
};

export default Repository;
