package planup.backend.mapper;

import planup.backend.dto.SprintRequest;
import planup.backend.dto.SprintResponse;
import planup.backend.model.Sprint;

import java.util.Date;

public class SprintMapper {
    public static Sprint toEntity(SprintRequest req){
        Sprint s=new Sprint();
        s.setName(req.getName());
        s.setGoal(req.getGoal());
        s.setStartDate(req.getStartDate()!=null? Date.from(req.getStartDate()):null);
        s.setEndDate(req.getEndDate()!=null? Date.from(req.getEndDate()):null);
        s.setCapacity(req.getCapacity()!=null? req.getCapacity().intValue():0);
        s.setTeamMembers(req.getTeamMembers());
        s.setStatus("planned");
        return s;
    }
    public static SprintResponse toResponse(Sprint s){
        SprintResponse res=new SprintResponse();
        res.setId(s.getId());
        res.setName(s.getName());
        res.setGoal(s.getGoal());
        res.setStartDate(s.getStartDate()!=null? s.getStartDate().toInstant():null);
        res.setEndDate(s.getEndDate()!=null? s.getEndDate().toInstant():null);
        res.setStatus(s.getStatus());
        res.setIssues(s.getIssues());
        res.setCapacity((double) s.getCapacity());
        res.setTeamMembers(s.getTeamMembers());
        return res;
    }
}
