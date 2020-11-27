import { useState, useEffect } from 'react';

import gitcolors from '../utils/gitcolors'
import styles from '../styles/Home.module.css'

import Header from '../components/Header'

import { RepositoryProps } from '../interfaces';

const Home = () => {

    const [repository, setRepository] = useState('');
    const [repositories, setRepositories] = useState<RepositoryProps[]>([]);

    useEffect(() => {
        const localRepositories = localStorage.getItem('repositories');
        console.log(localRepositories)

        if(!localRepositories) {
            localStorage.setItem('repositories', JSON.stringify([]));
        }else {
            const localRepositoriesJson: RepositoryProps[] =  JSON.parse(String(localRepositories));
            setRepositories(localRepositoriesJson);
        }
    }, [])

    const handleSearchRepository = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!repository.includes('/')) return alert('The search format must be "user-name/repository-name"')
        if(repository.split('/').length > 2) return alert('The search format must be "user-name/repository-name"')

        const response = await fetch(`https://api.github.com/repos/${repository}`);
        const data: RepositoryProps = await response.json();

        if(!data.id) return alert(data.message);
        //@ts-ignore
        const gitlanguage = gitcolors[data.language] || '#8e8e8e';

        const repo = {
            id: data.id,
            full_name: data.full_name,
            owner: {
                login: data.owner.login,
                avatar_url: data.owner.avatar_url,
                html_url: data.owner.html_url,
            },
            description: data.description,
            stargazers_count: data.stargazers_count,
            language: data.language,
            language_color: gitlanguage,
        };

        const findEqual = repositories.find(Repository => Repository.id == repo.id)
        if(findEqual) return;

        setRepositories(oldRepositories => [repo, ...oldRepositories]);
        console.log(repositories)
        localStorage.setItem('repositories', JSON.stringify(repositories));
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRepository(e.target.value);
    }

    return (
        <div className="container">
            <Header title="Github Explorer | Home"/>

            <form id="searchRepository" className={styles.form} onSubmit={handleSearchRepository}>
                <input type="text" onChange={handleChange} value={repository} placeholder="user-name/repository-name"/>
                <input type="button" value="Buscar" onClick={handleSearchRepository}/>
            </form>

            <div className={styles.list}>
                {repositories.map((repository, index) => (
                    <a id={index.toString()} href={`/repository/${repository.full_name}`} className={styles.listItem}>
                        <div className={styles.itemHeader}>
                            <img src={repository.owner.avatar_url} alt={`${repository.owner.avatar_url}'s photo`}/>
                            <h2>{repository.full_name}</h2>
                        </div>
                        <p>{repository.description ? repository.description : 'Sem descrição. :/' }</p>
                        <div className={styles.itemFooter}>
                            <div style={{ backgroundColor: repository.language_color }}  className={styles.lang}></div>
                            <span>{repository.language}</span>
                            <span>&#x2B50; {repository.stargazers_count}</span>
                        </div>
                    </a>
                ))}

                <a id="999" href="/teste" className={styles.listItem}>
                    <div className={styles.itemHeader}>
                        <img src="https://avatars3.githubusercontent.com/u/28955729?v=4" alt="LockDzn profile photo"/>
                        <h2>lockdzn/repo</h2>
                    </div>
                    <p>Repositório desse projeto.</p>
                    <div className={styles.itemFooter}>
                        <div style={{ backgroundColor: '#2b7489' }}  className={styles.lang}></div>
                        <span>TypeScript</span>
                        <span>&#x2B50; 5k</span>
                    </div>
                </a>

            </div>
        </div>
    )
}

export default Home;
