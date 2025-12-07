import { useFilter } from '@/contexts/filter-context';
import { ScrollArea } from '@/components/ui/scroll-area';
import styles from '@/styles/filter.module.css';
import { useState, useEffect } from "react";
import { useApiService } from '@/services/api.service';
import Category from '@/types/category';


export default function CategoryFilter({ onClick }: { onClick: () => void }) {
    const { filterState, setFilterState } = useFilter();
    const [categories, setCategories] = useState<Category[]>([]);
    const api = useApiService();
    const handleClick = (id: string) => {
        setFilterState((prev: any) => ({
            ...prev,
            category: prev.category === id ? null : id
        }))
        onClick();
    }
    const fetchData = async () => {
        try {
            const response = await api.category.getAll();
            setCategories(response.data);
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    return (
        <ScrollArea
            className={styles.filter_scroll_area}>
            {categories.map((category) => (
                <div
                    onClick={() => handleClick(category.id)}
                    key={category.id}
                    className={styles.filter_checkbox_label}>
                    <input
                        checked={filterState.category === category.id}
                        className={styles.filter_radio}
                        type="radio" readOnly />
                    <label
                        className='text-md cursor-pointer'>
                        {category.name}
                    </label>
                </div>
            ))}
        </ScrollArea>
    )
}
