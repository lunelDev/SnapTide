package com.example.InstaPrj.repository;

import com.example.InstaPrj.entity.Photos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PhotosRepository extends JpaRepository<Photos, Long>  {
    @Modifying
    @Query("delete from Photos pt where pt.feeds.fno=:fno")
    void deleteByFno(@Param("fno") long fno);

    @Modifying
    @Query("delete from Photos pt where pt.uuid=:uuid")
    void deleteByUuid(@Param("uuid")String uuid);

    @Query("select pt from Photos pt where pt.feeds.fno=:fno")
    List<Photos> findByFno(@Param("fno") Long fno);
}
