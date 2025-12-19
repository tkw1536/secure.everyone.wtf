import * as React from 'react';

type PageProps = {
    title: string,
    url: string,
    description: string,
    image?: string,
    children?: React.ReactNode,
}

export default class Page extends React.Component<PageProps> {
    componentDidMount() {
        this.updateHead();
    }

    componentDidUpdate() {
        this.updateHead();
    }

    updateHead() {
        const { title, url, description, image } = this.props;

        document.title = title;

        this.setMeta('og:url', url);
        this.setMeta('twitter:url', url, 'property');

        this.setMeta('name', title, 'itemprop');
        this.setMeta('og:title', title);
        this.setMeta('twitter:title', title, 'property');

        this.setMeta('description', description);
        this.setMeta('description', description, 'itemprop');
        this.setMeta('og:description', description);
        this.setMeta('og:site_name', description);
        this.setMeta('twitter:description', description, 'property');

        if (typeof image === 'string') {
            this.setMeta('image', image);
            this.setMeta('image', image, 'itemprop');
            this.setMeta('og:image', image);
            this.setMeta('twitter:image', image, 'property');
            this.setMeta('twitter:card', 'summary_large_image', 'property');
        }

        this.setMeta('og:type', 'website');
    }

    setMeta(name: string, content: string, attr: 'name' | 'property' | 'itemprop' = 'name') {
        let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute(attr, name);
            document.head.appendChild(meta);
        }
        meta.content = content;
    }

    render() {
        return <>{this.props.children}</>;
    }
}
