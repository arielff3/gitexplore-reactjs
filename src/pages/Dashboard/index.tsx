import React, { useState, FormEvent, useEffect } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import logo from '../../assets/logo.svg';

import { Title, Form, Repositorys, Error } from './styles';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storageRepositories = localStorage.getItem('@Github:Repositories');
    return storageRepositories ? JSON.parse(storageRepositories) : [];
  });

  useEffect(() => {
    localStorage.setItem('@Github:Repositories', JSON.stringify(repositories));
  }, [repositories]);

  async function handleAddReposity(
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();

    if (!newRepo) {
      setInputError('Digite autor/nome do repositório');
      return;
    }
    try {
      const response = await api.get<Repository>(`repos/${newRepo}`);

      const repository = response.data;

      setRepositories([...repositories, repository]);
      setNewRepo('');
      setInputError('');
    } catch (err) {
      setInputError('Erro na busca por esse repositório');
    }
  }

  return (
    <>
      <img src={logo} alt="logo" />
      <Title>Explore repositórios no Github</Title>

      <Form hasError={!!inputError} onSubmit={(e) => handleAddReposity(e)}>
        <input
          placeholder="Digite o nome do repositório"
          value={newRepo}
          onChange={(e) => setNewRepo(e.target.value)}
        />
        <button type="submit">Pesquisar</button>
      </Form>
      {inputError && <Error>{inputError}</Error>}
      <Repositorys>
        {repositories.map((repository) => {
          return (
            <Link
              to={`/repository/${repository.full_name}`}
              key={repository.full_name}
              href="teste"
            >
              <img
                src={repository.owner.avatar_url}
                alt={repository.owner.login}
              />
              <div>
                <strong>{repository.full_name}</strong>
                <p>{repository.description || 'Não contem descrição'}</p>
              </div>

              <FiChevronRight size={20} />
            </Link>
          );
        })}
      </Repositorys>
    </>
  );
};

export default Dashboard;
