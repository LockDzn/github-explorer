// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import User from 'path/to/interfaces';

export type RepositoryProps = {
    id: number,
    full_name: string;
    owner: {
        login: string;
        avatar_url: string;
        html_url: string;
    };
    description: string;
    stargazers_count: number;
    language: string;
    language_color: string;
    message?: string;
}


export type RepositoryDataProps = {
    id: number,
    full_name: string;
    owner: {
        login: string;
        avatar_url: string;
        html_url: string;
    };
    description: string;
    stargazers_count: number;
    language: string;
    language_color: string;
}

export type RepositoryIssuesEventProps = {
    id: number;
    html_url: string;
    number: number;
    title: string;
    user: {
        login: string;
        avatar_url: string;
    }
    state: string;
}
