import 'react';

function footer() {
    return (
    <div className="text-orange-500 bottom-10">
        {links(["hello","jieaf"])}
        <text>Created by Team Golfslag</text>
    </div>);
}

function links(texts: string[]) {
    // will be a list of objects with text, icon, link
    const formattedTexts = texts.map(text => 
    (<li>
        <a href="http://www.google.com">{text}</a>
    </li>)
    );
    return <ul>{formattedTexts}</ul>;
}

export default footer;