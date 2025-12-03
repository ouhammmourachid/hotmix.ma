import { Checkbox } from "@/components/ui/checkbox";
import {ScrollArea} from '@/components/ui/scroll-area';
import { useFilter } from '@/contexts/filter-context';
import styles from '@/styles/filter.module.css';
import { useState,useEffect } from "react";
import Size from '@/types/size';
import { useApiService } from '@/services/api.service';

export default function SizeFilter({onClick}:{onClick:()=>void}) {
    const {filterState,setFilterState} = useFilter();
    const [sizes, setSizes] = useState<Size[]>([]);
    const api = useApiService();
    const handleClick = (id:string) => {
        if(filterState.sizes.includes(id)){
            setFilterState((prev:any) => ({
                ...prev,
                sizes: prev.sizes.filter((sizeId:string) => sizeId !== id)
            }))
        } else {
            setFilterState((prev:any) => ({
                ...prev,
                sizes: [...prev.sizes, id]
            }))
        }
        onClick();
    }
    const fetchData = async () => {
        try {
          const response = await api.size.getAll();
            setSizes(response.data);
          } catch (err ) {
            console.log(err);
          }
      };
    useEffect(() => {
        fetchData();
    }, []);
    return (
        <ScrollArea
            className={styles.filter_scroll_area}>
            {sizes.map((size) => (
                <div
                    onClick={() => handleClick(size.id)}
                    key={size.id} className={styles.filter_checkbox_label}>
                    <Checkbox
                        checked={filterState.sizes.includes(size.id)}
                        className={styles.filter_checkbox}
                    />
                    <label
                        className='text-md cursor-pointer'>
                            {size.name}
                    </label>
                </div>
            ))}
        </ScrollArea>
    )
}
