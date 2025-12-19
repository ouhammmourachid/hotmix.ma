"use client"
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFilter } from '@/contexts/filter-context';
import styles from '@/styles/filter.module.css';
import { useState, useEffect } from "react";
import { useApiService } from '@/services/api.service';
import Tag from '@/types/tag';

export default function TagFilter({ onClick }: { onClick: () => void }) {
    const { filterState, setFilterState } = useFilter();
    const [tags, setTags] = useState<Tag[]>([]);
    const api = useApiService();
    const fetchData = async () => {
        try {
            const response = await api.tag.getAll();
            setTags(response.data);
        } catch (err) {
            console.log(err);
        }
    };
    const handleClick = (id: string) => {
        if (filterState.tags.includes(id)) {
            setFilterState((prev: any) => ({
                ...prev,
                tags: prev.tags.filter((tagId: string) => tagId !== id)
            }))
        } else {
            setFilterState((prev: any) => ({
                ...prev,
                tags: [...prev.tags, id]
            }))
        }
        onClick();
    }
    useEffect(() => {
        fetchData();
    }, []);
    return (
        <ScrollArea
            className={styles.filter_scroll_area}>
            {tags.map((tag) => (
                <div
                    onClick={() => handleClick(tag.id)}
                    key={tag.id}
                    className={styles.filter_checkbox_label}>
                    <Checkbox
                        checked={filterState.tags.includes(tag.id)}
                        className={styles.filter_checkbox}
                    />
                    <label
                        className='text-md cursor-pointer'>
                        {tag.name} ({tag.products_count})
                    </label>
                </div>
            ))}
        </ScrollArea>
    )
}
