
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'

import styles from '../../../styles/Repository.module.css'

import Header from '../../../components/Header'

import { RepositoryIssuesEventProps } from '../../../interfaces';

const Repository = () =>  {
    const router = useRouter();
    const { owner, repository } = router.query;

    const [issues, setIssues] = useState<RepositoryIssuesEventProps[]>([]);
    const [issuesPage, setIssuesPage] = useState(1);

    useEffect(() => {
        load();
    }, [owner, repository])

    useEffect(() => {
        load();
    }, [issuesPage])

    async function load() {

        if(!owner || !repository) return;

        console.log(issuesPage)
        
        const response = await fetch(`https://api.github.com/repos/${owner}/${repository}/issues?page=${issuesPage}`, { 
            method: 'get', 
            headers: new Headers({
              'Authorization': `token 5617e6b34d004bd9d5dc3c402dbdfe6bdf600231`, 
              'Accept': 'application/vnd.github.v3+json'
            })
        });
        const data: RepositoryIssuesEventProps[] = await response.json();
        setIssues(oldIssues => [...oldIssues, ...data]);
    }

    function addPage() {
        setIssuesPage(issuesPage+1);
    }

    return (
        <div>
            <Header title={`Github Explorer | ${owner}/${repository}`} />
            <div className={styles.title}>
                <h1>{owner}/{repository}</h1>
                <h2>{issues.length > 0 ? `Primeiras ${issues.length} issues abertas` : null}</h2>
            </div>

            <div className={styles.list}>
                {issues.length > 0 ? issues.map((issue, index) => (
                    <a id={index.toString()} href={issue.html_url} target="_blank" className={styles.item}>
                        <div className={styles.itemHeader}>
                            <img src={issue.user.avatar_url} alt={`${issue.user.login}'s photo`} />
                            <h1>{issue.title}</h1>
                        </div>
                        <div className={styles.itemFooter}>
                            <span>Por: {issue.user.login}</span>
                            <span>#{issue.number}</span>
                        </div>
                    </a>
                )) : (
                    <div>
                        <h2>Nenhuma issue encontrada</h2>
                    </div>
                )}

                {issues.length >= 30 ? (
                    <button className={styles.loadIssues} onClick={addPage}>Carregar mais</button>
                ): null}

            </div>
        </div>
    )

}

export default Repository;