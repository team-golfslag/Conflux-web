/*
  This program has been developed by students from the bachelor Computer Science at Utrecht
  University within the Software Models course.

  © Copyright Utrecht University (Department of Information and Computing Sciences)
*/

import {Card, CardContent} from "@/components/ui/card";
import {Product} from "@/types/models.ts";
import { AsyncState, useAsync } from "react-async"

type ProjectWorksProps = { products: Product[] }

/**
 * an async function which fetches the head of an url and return if the response was ok
 * @param {string} url
 * @returns {bool}
 */

const isValidLink = async (url : string) => {
    try{
      const response = await fetch(url, {method : "HEAD"}); //do a fetch without requiring full body data. only retrieve HEAD for status.
      return response.ok;
    }catch{
      return false; //url was false 
    }
}

/**
 * Project Works component
 * @param props the products to be turned into a card
 */
export default function ProjectWorks(props: ProjectWorksProps) {

    const validUrlArray : AsyncState<boolean>[] = []
    for(let i = 0 ; i < props.products.length; i++){
        const asyncObject : AsyncState<boolean> = useAsync(isValidLink(props.products[i].url));
        validUrlArray.push(asyncObject);
    }

    return (
        <section className="space-y-4 bg-white p-6 shadow rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Works</h2>
            {props.products.map((product, index) => (
                
                <Card key={product.id} className="bg-gray-200">
                    <CardContent className="flex items-center gap-4 p-3">
                        <div>
                            <p className="font-semibold">{product.title}</p>
                            <p className="text-sm text-gray-600">Details</p>
                            {validUrlArray[index].isResolved && validUrlArray[index].data ? 
                                <a target= "_blank" 
                                   href={product.url} 
                                   className="text-sm text-blue-600 hover:underline focus:text-purple-700">
                                    {product.url}</a> : 
                                <p className="text-sm text-gray-600">{product.url}</p>
                            }
                        </div>
                    </CardContent>
                </Card>
            ))}
        </section>
    );
}
