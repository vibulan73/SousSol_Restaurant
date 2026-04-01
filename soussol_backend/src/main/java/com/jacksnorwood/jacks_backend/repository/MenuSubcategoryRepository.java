package com.jacksnorwood.jacks_backend.repository;

import com.jacksnorwood.jacks_backend.entity.MenuSubcategory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface MenuSubcategoryRepository extends JpaRepository<MenuSubcategory, Long> {
    List<MenuSubcategory> findByCategoryIdOrderByDisplayOrderAsc(Long categoryId);
    List<MenuSubcategory> findAllByOrderByDisplayOrderAsc();
    Optional<MenuSubcategory> findByCategoryIdAndNameIgnoreCase(Long categoryId, String name);
}
