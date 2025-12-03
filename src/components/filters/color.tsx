import {ScrollArea} from '@/components/ui/scroll-area';
import { useFilter } from '@/contexts/filter-context';
import { Check } from "lucide-react";
import styles from '@/styles/filter.module.css';
import { useState,useEffect } from "react";
import { useApiService } from '@/services/api.service';
import Color from '@/types/color';

export default function ColorFilter({onClick}:{onClick:()=>void}) {
    const {filterState,setFilterState} = useFilter();
    const [colors, setColors] = useState<Color[]>([]);
    const api = useApiService();
    const fetchData = async () => {
        try {
          const response = await api.color.getAll();
            setColors(response.data);
          } catch (err ) {
            console.log(err);
          }
      };
    const handleClick = (id:string) => {
        if(filterState.colors.includes(id)){
            setFilterState((prev:any) => ({
                ...prev,
                colors: prev.colors.filter((colorId:string) => colorId !== id)
            }))
        } else {
            setFilterState((prev:any) => ({
                ...prev,
                colors: [...prev.colors, id]
            }))
        }
        // delay the onClick function to give time for the filter to update
        onClick();
    }
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <ScrollArea
            className={styles.filter_scroll_area + ' border-r border-[#014751]'}>
            {colors.map((color) => (
                <div
                    onClick={() => handleClick(color.id)}
                    key={color.id}
                    className={styles.filter_checkbox_label}>
                    <div className="relative">
                        {/* Outer ring */}
                        <div className={`${styles.filter_color_ring} ${filterState.colors.includes(color.id) ? 'border-2' : ''}`}/>
                        {/* Inner colored circle */}
                        <div
                            style={{
                            backgroundColor: color.code,
                            }}
                            className={styles.filter_color_circle}>
                            {filterState.colors.includes(color.id) && <Check size={15} />}
                        </div>
                    </div>
                    <label
                        className='text-md cursor-pointer'>
                        {color.name}
                    </label>
                </div>
            ))}
        </ScrollArea>
    )
}
